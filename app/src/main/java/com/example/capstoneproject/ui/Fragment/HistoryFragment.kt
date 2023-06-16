package com.example.capstoneproject.ui.Fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import com.example.capstoneproject.databinding.FragmentHistoryBinding
import com.example.capstoneproject.models.HistoryViewModel
import com.example.capstoneproject.preferences.PreferenceRepository
import com.example.capstoneproject.preferences.UserPreference
import kotlinx.coroutines.launch

class HistoryFragment : Fragment() {


    private lateinit var historyViewModel: HistoryViewModel
    private var _binding: FragmentHistoryBinding? = null
    private val binding get() = _binding!!

    private lateinit var pref : PreferenceRepository
    private var uid : String? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        historyViewModel =
            ViewModelProvider(this).get(HistoryViewModel::class.java)

        _binding = FragmentHistoryBinding.inflate(inflater, container, false)

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        pref = PreferenceRepository.getInstance(UserPreference(requireContext()))
        uid = pref.getUser("UID")
        lifecycleScope.launch {
        }

    }
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}